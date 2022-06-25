// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		let tag;

		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		}
		else if (type === "js") {
			tag = document.createElement("script");
			tag.src = url;
		}
		if (tag) {
			tag.onload = () => resolve(url);
			tag.onerror = () => reject(url);
			document.head.appendChild(tag);
		}
	});
}
if (screen.width >= 768) {
	const api_path = '/wp-content/themes/Sakura/live2d/'
	const cdn_path = 'https://cdn.jsdelivr.net/gh/Lin515/Sakura@master/live2d/';
	Promise.all([
		loadExternalResource(cdn_path + "waifu.min.css", "css"),
		loadExternalResource(cdn_path + "live2d.min.js", "js"),
		loadExternalResource(cdn_path + "waifu-tips.min.js", "js")
	]).then(() => {
		/* 可直接修改部分参数 */
		live2d_settings['modelAPI']		= api_path;
		live2d_settings['showToolMenu'] = false; // 不显示工具栏
		live2d_settings['modelStorage'] = false; // 不储存模型 ID
		live2d_settings['modelId'] = 1; // 显示Pio
		live2d_settings['modelTexturesId'] = Math.floor(Math.random()*87) + 1; // 获取1~87的随机整数 Poi一共有87件衣服
		live2d_settings['waifuEdgeSide'] = 'left:0';     // 看板娘贴边方向，例如 'left:0'(靠左 0px), 'right:30'(靠右 30px)
		live2d_settings['showHitokoto'] = false;         // 关闭一言
		/* 在 initModel 前添加 */
		initModel(cdn_path + 'waifu-tips.json');
	});
}