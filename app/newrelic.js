/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {

  app_name: ['Esa2015'],

  /**
   * Your New Relic license key.
   */
  license_key: '79a59935ca1ef53f4dd0baf6b7e3052547036cb3',
  agent_enabled: process.env.NODE_ENV === 'production',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
};
