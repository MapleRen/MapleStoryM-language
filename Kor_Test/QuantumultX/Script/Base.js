//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config = {
    API: 'http://api.github.com/repos/MapleRen/MapleStoryM-language/contents/?ref=master',
    files: ['data.bin.lan.kor.tbl', 'data.table.unity3d'],
    prefix: 'msm_kor_needRedirect',
    model: 'msm_kor_model',//模式切换
    title: '基础汉化',
    MODEL_TRANSLATE:'translate',
    MODEL_CLEAR:'clear'
}
const isResponse = typeof $response != "undefined";
const model = $prefs.valueForKey(config.model);//当前模式
function rewrite() {
    const body = $response.body;
    let list = body.split('\n');
    $task.fetch({ url: config.API }).then(response => {
        if (response.statusCode != 200) {
            notifyAndSetValue('API请求过于频繁，请稍后再试', 'false');
            $done({});
        }
        let data = JSON.parse(response.body);
        let tbl_size = data.find(x => x.name == 'data.bin.lan.kor.tbl').size;
        if (body.indexOf(tbl_size) > -1) {
            for (let i = 0; i < list.length; i++) {
                const file = config.files.filter(item => list[i].indexOf(item) > -1);
                if (file.length > 0) {
                    let item = data.find(x => x.name == file[0]);
                    list[i] = list[i].replace(/Size="[0-9.]*?"/i, 'Size="' + item.size + '"').replace(/FileCRC="[0-9.]*?"/i, 'FileCRC="0"').replace(/ CRC="[0-9.]*?"/i, ' CRC="0"').replace(/OriginalCRC="[0-9.]*?"/i, 'OriginalCRC="0"')
                }
            }
            notifyAndSetValue('补丁下载完成即可完成汉化', 'true');
            var xml = list.join('\n');
            $done(xml);

        } else {
            notifyAndSetValue('汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息', 'false');
            $done({});
        }
    }, reason => {
        notifyAndSetValue(reason.error, 'false');
        $done(body);
    });
}

function notifyAndSetValue(msg, success) {
    $notify(config.title, "", msg);
    $prefs.setValueForKey(success, config.prefix)
}

function redirect() {
    const github_path = 'https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/';
    const need_redirect = $prefs.valueForKey(config.prefix);
    const file_name = $request.url.slice($request.url.lastIndexOf('@') + 1);
    if (need_redirect == 'true') {
        var mStatus = "HTTP/1.1 302 Found";
        var mHeaders = { "Location": `${github_path}${file_name}` };
        var mResponse = {
            status: mStatus,
            headers: mHeaders
        }
        $done(mResponse);
    }
}

function clear() {
    var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;
    var isAssetBundleTable = $request.url.indexOf('AssetBundle_table.xml') > -1;
    var isRedirect = $request.url.indexOf('_1/') > -1;
    if (isMarketVersions) {
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
        var mStatus = "HTTP/1.1 302 Found";
        var mHeaders = { "Location": $request.url.replace('_1/', '/') };
        var mResponse = {
            status: mStatus,
            headers: mHeaders
        }
        $done(mResponse);
    } else if (isAssetBundleTable) {
        var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
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
}

if (isResponse) {
    if (model == config.MODEL_TRANSLATE) {
        if ($request.url.indexOf('AssetBundle_table.xml') != -1) {
            rewrite();
        } else {
            redirect();
        }
    } else if (model == config.MODEL_CLEAR) {
        clear();
    }else{
        $done({});
    }
}else{
    switch (model) {
        case config.MODEL_TRANSLATE:
            $notify("冒险岛M", "", "成功切换为：缓存清理模式");
            $prefs.setValueForKey(config.MODEL_CLEAR, config.model)
            break;
        default:
            $notify("冒险岛M", "", "成功切换为：汉化清理模式");
            $prefs.setValueForKey(config.MODEL_TRANSLATE, config.model)
            break;
    }
}
