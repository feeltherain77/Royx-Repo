class AnimeVietsub extends MainAPI {
    constructor() {
        super();
        this.name = "AnimeVietsub";
        this.mainPage = "https://bit.ly/animevietsubtv"; // Link trung gian của ông
    }

    async search(query) {
        const res = await request(this.mainPage);
        const domain = res.url.endsWith('/') ? res.url.slice(0, -1) : res.url;
        const html = (await request(`${domain}/tim-kiem/${encodeURIComponent(query)}/`)).text;
        const results = [];
        const regex = /<div class="media-left">[^]*?href="([^"]+)" title="([^"]+)"[^]*?src="([^"]+)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            results.push({
                name: match[2],
                url: match[1].startsWith('http') ? match[1] : domain + match[1],
                posterUrl: match[3],
                type: SearchType.Anime
            });
        }
        return results;
    }

    async loadLinks(data) {
        const html = (await request(data)).text;
        const links = [];
        const regex = /"(https?[:\\/\w\.-]+\.m3u8[^"]*)"/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            links.push({
                url: match[1].replace(/\\/g, ""),
                name: "Server Mạnh DZ VIP",
                quality: 1080,
                isM3u8: true
            });
        }
        return links;
    }
}
export default new AnimeVietsub();
