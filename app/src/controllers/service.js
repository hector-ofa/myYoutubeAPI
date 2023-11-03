const config = require('../config/config');
const { google } = require('googleapis');
const youtube = google.youtube('v3');

class serviceController {
  async getVideos(params) {
    try {
      // Make an API request to get a list of most popular videos
      const response = await youtube.videos.list({
        auth: config.AUTH, // API key
        part: params.part,
        chart: params.chart,
        maxResults: params.maxResults,
        regionCode: params.regionCode,
        myRating:params.myRating,
        maxHeight:params.maxHeight,
        maxWidth:params.maxWidth,
        onBehalfOfContentOwner:params.onBehalfOfContentOwner,
        videoCategoryId:params.videoCategoryId
      });

      // Extract the video data from the response
      const videos = response.data.items;

      return videos;
    } catch (error) {
      console.error('Error making YouTube Data API request:', error);
      throw error;
    }
  }

  async getChannels(params) {
    try {
        // Make an API request to get channel information
        const response = await youtube.channels.list({
            auth: config.AUTH, // API key
            part: params.part,
            forUsername: params.forUsername,
            id: params.id,
            managedByMe: params.managedByMe,
            mine: params.mine,
            hl: params.hl,
            maxResults: params.maxResults,
            onBehalfOfContentOwner: params.onBehalfOfContentOwner,
            pageToken: params.pageToken
        });

        // Extract the channel data from the response
        const channels = response.data.items;

        return channels;
    } catch (error) {
        console.error('Error making YouTube Data API request for channels:', error);
        throw error;
    }
}

}

module.exports = serviceController;
