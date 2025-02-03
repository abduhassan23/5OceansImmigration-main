import client from '@/app/libs/prismadb';

export const sendNotification = async ({ userId, content }) => {
    try {
      const notification = await client.notification.create({
        data: {
          userId,
          content,
        },
      });
      return notification; // Optionally return the created notification
    } catch (error) {
      console.error('Error sending notification:', error.message);
      throw new Error('Failed to send notification'); // Throw an error to handle upstream
    }
  };
  
