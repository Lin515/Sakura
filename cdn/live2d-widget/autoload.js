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
	const live2d_path = "/wp-content/themes/Sakura/cdn/live2d-widget/";
	Promise.all([
		loadExternalResource(live2d_path + "waifu.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js"),
		loadExternalResource(live2d_path + "waifu-tips.min.js", "js")
	]).then(() => {
		/* 可直接修改部分参数 */
		live2d_settings['showToolMenu'] = false; // 不显示工具栏
		live2d_settings['modelStorage'] = false; // 不储存模型 ID
		live2d_settings['modelId'] = 1; // 显示Poi
		live2d_settings['modelTexturesId'] = Math.floor(Math.random()*87) + 1; // 获取1~87的随机整数 Poi一共有87件衣服
		/* 在 initModel 前添加 */
		initModel(live2d_path + 'waifu-tips.json');
	});
}