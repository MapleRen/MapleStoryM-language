var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;
var isAssetBundleTable = $request.url.indexOf('AssetBundle_table.xml') > -1;
var isRedirect = $request.url.indexOf('_1/') > -1;
if (isMarketVersions) {
    //资源版本缓存强制清理
    var body = $response.body;
    var list = body.split('\n');
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('\/AppStore\/') > -1) {
            list[i] = list[i].replace('/" Server', '_1/" Server')
        }
    }
    var xmlData = list.join('\n')
    $done(xmlData)
} else if (isRedirect) {
    //资源版本重定向
    var mStatus = "HTTP/1.1 302 Found";
    var mHeaders = { "Location": $request.url.replace('_1/', '/') };
    var mResponse = {
        status: mStatus,
        headers: mHeaders
    }
    $done(mResponse);
} else if (isAssetBundleTable) {
    //修改官方文件Version，强制清空已下载的文件
    var fileList = ['data.bin.lan.jpn.tbl', 'data.language_jpn.unity3d', 'data.table.unity3d']
    var body = $response.body;
    var list = body.split('\n');
    for (let i = 0; i < list.length; i++) {
        var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
        if (flag) {
            list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
        }
    }
    $notify("冒险岛M", "", "文件重置完成，弹出更新框后(也可下载完毕后)关闭游戏，切换模式后重新进入游戏即可完成汉化");
    var xmlData = list.join('\n')
    $done(xmlData)
} else {
    $done({});
}