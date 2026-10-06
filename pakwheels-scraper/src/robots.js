const axios = require("axios");
const robotsParser = require("robots-parser");

const BASE_URL = "https://www.pakwheels.com";
const ROBOTS_URL = `${BASE_URL}/robots.txt`;

/**
 * Loads robots.txt and initializes a robots parser instance.
 * Handles 403, 404 or network errors gracefully without crashing.
 */
async function loadRobots(userAgent = "UniversityResearchScraper/1.0") {
  try {
    const res = await axios.get(ROBOTS_URL, {
      timeout: 10000,
      headers: { "User-Agent": userAgent },
      validateStatus: () => true, // Don't throw on 403/404
    });

    if (res.status === 200 && typeof res.data === "string") {
      return {
        parser: robotsParser(ROBOTS_URL, res.data),
        raw: res.data,
        status: 200,
      };
    }

    // PakWheels commonly returns 403 to automated robots.txt fetch.
    // In that case, we record the response status responsibly.
    return {
      parser: null,
      raw: null,
      status: res.status,
      message: `Endpoint returned HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      parser: null,
      raw: null,
      status: err.response ? err.response.status : 500,
      message: err.message,
    };
  }
}

function isUrlAllowed(robotsInfo, url, userAgent = "UniversityResearchScraper/1.0") {
  if (!robotsInfo || !robotsInfo.parser) {
    // If robots.txt was inaccessible (e.g. 403), proceed responsibly with rate limits
    return true;
  }
  return robotsInfo.parser.isAllowed(url, userAgent);
}

module.exports = {
  BASE_URL,
  ROBOTS_URL,
  loadRobots,
  isUrlAllowed,
};
