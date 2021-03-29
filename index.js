const cherrio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const url = `https://gogoanime.ai/boruto-naruto-next-generations-episode-`;
const REQ_BASE_URL = `https://gogo-play.net/ajax.php?id=`;
(async () => {
    for (let i = 1; i <= 169; i += 1) {
        const rawData = await fetch(`${url}${i}`);
        const data = await rawData.text();
        const $ = cherrio.load(data);
        const $iframeLink = $('.play-video iframe');
        const videoUrl = $iframeLink.attr('src');
        const params = new URLSearchParams(videoUrl);
        const id = params.get('//gogo-play.net/streaming.php?id');
        const REQ_URL = `${REQ_BASE_URL}${id}`;
        const rawResponseLink = await fetch(REQ_URL);
        const responseLink = await rawResponseLink.json();
        const fileLink = await responseLink.source[0].file;
        const response = await fetch(fileLink);
        const buffer = await response.buffer();
        fs.writeFile(`./boruto-naruto-next-generations-episode-${i}.mp4`, buffer, (i) => console.log(`${i} finished downloading!`));
    }

})();