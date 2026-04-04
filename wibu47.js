// Wibu47 Provider - Bản sắc Trùm Cuối 😒🥂
const Wibu47 = {
    name: "Wibu47",
    baseUrl: "https://wibu47.vip",
    
    // 1. Lấy danh sách phim trang chủ rực rỡ bản sắc
    async getHome() {
        const response = await this.request(this.baseUrl);
        const regex = /<div class="item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            results.push({
                name: match[2].trim(),
                url: match[1],
                poster: match[3],
                type: "Anime"
            });
        }
        return results;
    },

    // 2. Tìm kiếm phim kịch độc
    async search(query) {
        const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const response = await this.request(searchUrl);
        const regex = /<div class="result-item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            results.push({
                name: match[2].trim(),
                url: match[1],
                poster: match[3]
            });
        }
        return results;
    },

    // 3. Vắt kiệt thông tin tập phim (Episodes)
    async getDetail(url) {
        const response = await this.request(url);
        // Regex bắt link tập phim và số tập
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        let episodes = [];
        let match;

        while ((match = regex.exec(response)) !== null) {
            episodes.push({
                name: `Tập ${match[2].trim()}`,
                url: match[1]
            });
        }
        return { 
            episodes: episodes.reverse() // Đảo lại cho đúng thứ tự tập 1 lên đầu
        };
    },

    // 4. BẮT LINK PLAYER (SIÊU THOÁT)
    async getStream(url) {
        const response = await this.request(url);
        // Tìm iframe chứa link video
        const iframeMatch = /<iframe[\s\S]*?src="([^"]+)"/i.exec(response);
        
        if (!iframeMatch) return null;
        const videoUrl = iframeMatch[1];

        return {
            links: [{
                url: videoUrl,
                quality: "HD",
                isM3u8: videoUrl.includes(".m3u8") || videoUrl.includes("m3u8")
            }]
        };
    }
};
