const request = require('request');

async function get(url){
  return  new Promise(resolve=>{
  	request(url, (err, res, body) => {
     resolve(body);
  });
  }) 
}
exports.handleRequest = async (ctx, next) => {
   //rewrite
   if(ctx.fullUrl.indexOf('Korea_default')>-1){
     var str = `
UseLagecyTable
DisableSlangCheck
DisableLanguageHashCheck
`

      var body = await get(ctx.fullUrl);
   	  ctx.body = body.replace('UseLagecyTable',str)
     
   }
 };