var body = $response.body;
var list = body.split('\n');
var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;

if (isMarketVersions) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('\/AppStore\/') > -1) {
            list[i] = list[i].replace('/" Server', '_1/" Server')
        }
    }
} else {
    for (let i = 0; i < list.length; i++) {
        var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
        if (flag) {
            list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
        }
    }
}

var xmlData = list.join('\n')
console.log(xmlData);
$done(xmlData)
