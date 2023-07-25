const fs = require('fs');
const glob = require('glob');
const request = require('request');
const path = require('path');
const { JSDOM } = require('jsdom')

// const saveResultDir = path.resolve(__dirname,`./result`)

// if (!fs.existsSync(saveResultDir)) {
//   fs.mkdir(saveResultDir, { recursive: true }, (e) => {
//     console.log('ERROR mkdir', e)
//   });
// }

// const url = "https://www.i-studio.co.jp/"

// request.get({
//   uri: url,
//   headers: {'Content-type': 'text/html;'},
// }, function(err, req, data){
//   if(req.statusCode == 200){
//     console.log('RESULT')
//     console.log(data)
//     fs.writeFileSync(`${saveResultDir}/test.html`, data);
//   }
//   console.log("complate:",url)
// });



const sampleDomText = fs.readFileSync(path.resolve(__dirname,"result/test.html"),'utf8')

// console.log('sampleDomText')
// console.log(sampleDomText)

const dom = new JSDOM(sampleDomText,{
  // runScripts: "dangerously",
  // resources: "usable"
});

// console.log('DOM')
// console.log(dom)

const aTagElms = dom.window.document.querySelector('a')

console.log('aTagElms')
console.log(aTagElms)


// const urls = fs
//   .readFileSync(
//     path.resolve(__dirname,"url.txt"),'utf8'
//   )
//   .split('\n')
//   .filter(t=>t.length > 0);

// const get = (url) =>{
//   return new Promise((resolve, reject)=>{
//     request.get({
//       uri: url,
//       headers: {'Content-type': 'text/html;'},
//     }, function(err, req, data){
//       if(req.statusCode == 200){
//         resolve(data)
//         //fs.writeFileSync(path.resolve(__dirname,`./temp-${Date.now()}.html`), data);
//       }
//       console.log("complate:",url);
//       resolve("");
//     });
//   })
// }

// const htmlParse = (htmlText) =>{
//   try{
//     const dom = new JSDOM(htmlText,{
//       runScripts: "dangerously",
//       resources: "usable"
//     });
//     // get element
//     setTimeout(()=>{
//       const text = dom.window.document.title;
//       console.log(`text:`,text);
//     },1000);
//   }catch (e){
//     console.error(e)
//   }
// }

// Promise.all(urls.map(url=>get(url))).then((htmls)=>{
//   htmls.forEach((html) => {
//     htmlParse(html)
//   });
// });

// glob.sync(path.resolve(__dirname,`./temp-*.html`)).forEach((p)=>{
//   fs.unlinkSync(p);
// });