//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const api_url = 'https://api.github.com/repos/MapleRen/MapleStoryM-language/contents/?ref=master';
let config = {
    url: api_url
}
const body = $response.body;
let list = body.split('\n');
const files = ['data.bin.lan.kor.tbl', 'data.table.unity3d']
const prefix = 'msm_kor_needRedirect'
$task.fetch(api_url).then(response => {
    if (response.statusCode != 200) {
        $notify("汉化失败", "", 'API请求过于频繁，请稍后再试');
        $prefs.setValueForKey('false', prefix)
        $done({});
    }
    let data = JSON.parse(response.body);
    let tbl_size = data.find(x => x.name = 'data.bin.lan.kor.tbl').size;
    if (body.indexOf(tbl_size) === -1) {
        $notify("汉化失败", "", '汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息');
        $prefs.setValueForKey('false', prefix)
        $done({});
    } else {
        for (let i = 0; i < list.length; i++) {
            const flag = files.filter(item => list[i].indexOf(x)).length > 0;
            if (flag) {
                let item = data.find(x => x.name = flag[0]);
                list[i] = list[i].replace(/Size="[0-9.]*?"/i, `Size="${item.size}"`).replace(/FileCRC="[0-9.]*?"/i, `FileCRC=""`).replace(/CRC="[0-9.]*?"/i, `CRC=""`).replace(/OriginalCRC="[0-9.]*?"/i, `OriginalCRC=""`)
            }
        }
        $notify("汉化完成", "", '补丁下载完成即可完成汉化');
        $prefs.setValueForKey('true', prefix)
        $done(list.join('\n'));
    }
}, reason => {
    $notify("基础汉化失败", "", reason.error);
    $prefs.setValueForKey('false', prefix)
    $done({});
});