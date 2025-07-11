export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Only set serviceId if it's not already provided
    if (!data.serviceId) {
      try {
        // Get the highest serviceId from existing services
        const result = await strapi.db.query('api::service.service').findMany({
          select: ['serviceId'],
          orderBy: { serviceId: 'desc' },
          limit: 1,
        });

        // Set the new serviceId to the highest + 1, or start with 1 if no services exist
        const nextId =
          result.length > 0 && result[0].serviceId
            ? result[0].serviceId + 1
            : 1;

        data.serviceId = nextId;
      } catch (error) {
        console.error('Error generating serviceId:', error);
        // Fallback: start with 1 if there's an error
        data.serviceId = 1;
      }
    }
  },
}; 