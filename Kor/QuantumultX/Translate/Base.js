//用于获取仓库里data.bin.lan.kor.tbl的size，与最新xml里的Size做比较
const api_url = 'https://api.github.com/repos/MapleRen/MapleStoryM-language/contents/?ref=master';
let config = {
    url :api_url
}

const body = $response.body;
let list = body.split('\n');
let tbl = list.find(x => x.indexOf('data.bin.lan.kor.tbl') > -1)
let tbl_size = '';

$task.fetch(myRequest).then(response => {
    console.log(response.headers);
    let data = JSON.parse(response.body);
    let item = data.find(x=> x.name = 'data.bin.lan.kor.tbl');
    tbl_size = item.size;
    $notify("Title", "Subtitle", response.body); // Success!
}, reason => {
    $notify("基础汉化失败", "", reason.error); // Error!
});