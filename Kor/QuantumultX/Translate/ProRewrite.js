//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const config ={
    API:'https://api.github.com/repos/MapleRen/MapleStoryM-language/contents/?ref=master',
    files:['data.bin.lan.kor.tbl', 'data.table.unity3d','data.language_kor.unity3d'],
    prefix:'msm_kor_needRedirect',
    title:'进阶汉化'
}
const body = $response.body;
let list = body.split('\n');
$task.fetch(config.API).then(response => {
    if (response.statusCode != 200) {
        $notify(`${title}失败`, "", 'API请求过于频繁，请稍后再试');
        $prefs.setValueForKey('false', config.prefix)
        $done({});
    }
    let data = JSON.parse(response.body);
    let tbl_size = data.find(x => x.name = 'data.bin.lan.kor.tbl').size;
    if (body.indexOf(tbl_size) === -1) {
        $notify(`${title}失败`, "", '汉化文件未更新，请关注微博"冒险岛M第三汉化委"获取最新消息');
        $prefs.setValueForKey('false', config.prefix)
        $done({});
    } else {
        for (let i = 0; i < list.length; i++) {
            const flag = config.files.filter(item => list[i].indexOf(x)).length > 0;
            if (flag) {
                let item = data.find(x => x.name = flag[0]);
                list[i] = list[i].replace(/Size="[0-9.]*?"/i, `Size="${item.size}"`).replace(/FileCRC="[0-9.]*?"/i, `FileCRC=""`).replace(/CRC="[0-9.]*?"/i, `CRC=""`).replace(/OriginalCRC="[0-9.]*?"/i, `OriginalCRC=""`)
            }
        }
        $notify(`${title}完成`, "", '补丁下载完成即可完成汉化');
        $prefs.setValueForKey('true', config.prefix)
        $done(list.join('\n'));
    }
}, reason => {
    $notify(`${title}失败`, "", reason.error);
    $prefs.setValueForKey('false', config.prefix)
    $done({});
});