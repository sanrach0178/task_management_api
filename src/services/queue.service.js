const { Queue, Worker } = require('bullmq');
const axios = require('axios');
const IORedis = require('ioredis');

const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
};

const connectionOptions = process.env.REDIS_URL ? {
    url: process.env.REDIS_URL,
    maxRetriesPerRequest: null,
} : redisOptions;

const remindersQueue = new Queue('TaskReminders', { connection: connectionOptions });

const reminderWorker = new Worker('TaskReminders', async job => {
    console.log(`\n[REMINDER] Task "${job.data.title}" (ID: ${job.data.id}) is due at ${job.data.dueDate}.`);
}, {
    connection: connectionOptions,
});

reminderWorker.on('error', err => {
    console.error('\n[REMINDER WORKER ERROR]', err.message);
});

const scheduleReminder = async (task) => {
    if (!task.dueDate) return null;
    if (task.status === 'completed') return null;

    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    let delay = dueTime - now - oneHour;

    if (delay < 0) {
        delay = 0;
    }

    const jobId = `task-reminder-${task.id}`;

    await removeReminder(task.id);

    await remindersQueue.add('reminderJob', {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate
    }, {
        jobId,
        delay
    });

    return jobId;
};

const removeReminder = async (taskId) => {
    const jobId = `task-reminder-${taskId}`;
    const job = await remindersQueue.getJob(jobId);
    if (job) {
        await job.remove();
    }
};

const webhooksQueue = new Queue('TaskWebhooks', { connection: connectionOptions });

const webhookWorker = new Worker('TaskWebhooks', async job => {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
        await axios.post(webhookUrl, job.data);
    } catch (error) {
        throw error;
    }
}, {
    connection: connectionOptions,
});

webhookWorker.on('error', err => {
    console.error('\n[WEBHOOK WORKER ERROR]', err.message);
});

const triggerCompletionWebhook = async (task) => {
    const payload = {
        id: task.id,
        title: task.title,
        completedAt: new Date().toISOString(),
        userId: task.userId
    };

    await webhooksQueue.add('completionWebhookJob', payload, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        }
    });
};

module.exports = {
    scheduleReminder,
    removeReminder,
    triggerCompletionWebhook
};
