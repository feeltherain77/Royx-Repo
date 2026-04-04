// Provider Wibu47.vip - cCccls
// Note: Code này dùng cho hệ CloudStream JS Providers

const Wibu47 = {
    name: "Wibu47",
    baseUrl: "https://wibu47.vip",
    apiUrl: "https://wibu47.vip/wp-admin/admin-ajax.php", // Cái nết lấy phim của WP

    // 1. Lấy danh sách phim ở Trang Chủ
    async getHome() {
        const html = await this.request(this.baseUrl);
        // "Vun" ảnh bìa, tên phim và link từ class .top-view-phim hoặc .list-film
        const regex = /<a href="(https:\/\/wibu47\.vip\/phim\/[^"]+)" title="([^"]+)">[\s\S]*?src="([^"]+)"/g;
        let results = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            results.push({
                name: match[2],
                url: match[1],
                poster: match[3]
            });
        }
        return results;
    },

    // 2. Hàm Tìm Kiếm (Search) cho nó bản lĩnh
    async search(query) {
        const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const html = await this.request(searchUrl);
        // Tương tự, "vả" vào kết quả tìm kiếm để lấy list phim
        const regex = /<div class="result-item">[\s\S]*?href="([^"]+)" title="([^"]+)"[\s\S]*?src="([^"]+)"/g;
        // ... (Logic trả về list tương tự getHome)
    },

    // 3. Lấy thông tin chi tiết & Tập phim (Load tập phim)
    async getDetail(url) {
        const html = await this.request(url);
        // Soi cái danh sách tập phim trong class .list-episode
        const regex = /<a href="([^"]+)" class="episode-link">Tập ([^<]+)<\/a>/g;
        // Trả về danh sách tập cho đại ca "mlem"
    },

    // 4. BẮT LINK PLAYER (BƯỚC NHÓT NÃO NHẤT)
    async getStream(url) {
        const html = await this.request(url);
        // Wibu47 thường dùng Iframe giấu link. Ta phải "vun" cái link Iframe đó ra.
        const iframeRegex = /<iframe[\s\S]*?src="([^"]+)"/i;
        const iframeUrl = iframeRegex.exec(html)[1];

        // Nếu iframeUrl là link DailyMotion, DoodStream hay Gdrive...
        // CloudStream nó có sẵn "Extractors" để tự động vắt link m3u8/mp4.
        // Đại ca chỉ cần "vẩy" link iframe vào hệ thống là xong! 😒🥂
        return {
            links: [{
                url: iframeUrl,
                quality: "HD",
                isM3u8: iframeUrl.includes(".m3u8")
            }]
        };
    }
};
