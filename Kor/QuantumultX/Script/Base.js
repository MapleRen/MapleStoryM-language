//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
    API:'http://api.github.com/repos/MapleRen/MapleStoryM-language/contents/?ref=master',
    files:['data.bin.lan.kor.tbl', 'data.table.unity3d'],
    prefix:'msm_kor_needRedirect',
    title:'基础汉化'
}

function rewrite() {
    const body = $response.body;
    let list = body.split('\n');
    $task.fetch({url:config.API}).then(response => {
        if (response.statusCode != 200) {
            $notify("汉化失败", "", 'API请求过于频繁，请稍后再试');
            $prefs.setValueForKey('false', config.prefix)
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
            $notify("汉化完成", "", '补丁下载完成即可完成汉化');
            $prefs.setValueForKey('true', config.prefix)
            var xml = list.join('\n');
            $done(xml);

        } else {
            $notify("汉化失败", "", '汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息');
            $prefs.setValueForKey('false', config.prefix)
            $done({});
        }
    }, reason => {
        $notify("基础汉化失败", "", reason.error);
        $prefs.setValueForKey('false', config.prefix)
        $done(body);
    });
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

if($request.url.indexOf('AssetBundle_table.xml') != -1){
    rewrite();
}else{
    redirect();
}