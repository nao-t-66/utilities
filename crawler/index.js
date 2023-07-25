const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const searchRootURL = 'https://www.digital.go.jp/';
const targetURL = 'https://www.digital.go.jp/';

let finishFlg = false;

const saveResultDir = path.resolve(__dirname,`./result`);


// let loopCount = 0
// while(loopCount < 10){
//   loopCount++
//   console.log(loopCount)
// }


async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
};


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 
  
  try {
    console.log('=== GOTO ===')
    await page.goto(searchRootURL, {
      waitUntil:'load',
      timeout:60000
    });
    const hrefs = await page.$$eval("a", (list) => list.map((elm) => elm.href));
    const targetLinkAry = hrefs.filter(link => link.startsWith(targetURL))
    // console.log('targetLinkAry', targetLinkAry)
    // await fs.writeFileSync(`${saveResultDir}/test.txt`, String(hrefs));
    await checkLinks(targetLinkAry)
    await checkURL(searchRootURL)
    // console.log('===== checkURLListObj =====', checkURLListObj)

    let loopCount = 0
    while(loopCount < 1000 && !finishFlg){
      loopCount++
      console.log(loopCount)
      let keyAry = Object.keys(checkURLListObj)
      keyAry = keyAry.filter(key => !checkURLListObj[key])
      console.log(keyAry)
      if(keyAry.length <= 0){
        finishFlg = true;
        break;
      }
      checkURLListObj[keyAry[0]] = true

      if(
        !keyAry[0].includes('.pdf') &&
        !keyAry[0].includes('.zip') &&
        !keyAry[0].includes('.csv') &&
        !keyAry[0].includes('.xlsx')
      ){
        console.log('=== GOTO ===')
        await page.goto(keyAry[0], {
          waitUntil:'load',
          timeout:60000
        })
        const inLoopHrefs = await page.$$eval("a", (list) => list.map((elm) => elm.href));
        const inLoopTargetLinkAry = inLoopHrefs.filter(link => link.startsWith(targetURL))
        await checkLinks(inLoopTargetLinkAry)
      }

      // await page.goto(searchRootURL);
      // const hrefs = await page.$$eval("a", (list) => list.map((elm) => elm.href));
      // const targetLinkAry = hrefs.filter(link => link.startsWith(targetURL))
      sleep(1000)
    }

  } catch (err) {
    // エラーが起きた際の処理
    console.log('=== ERROR ===')
    console.log(err)
  } finally {
    await fs.writeFileSync(`${saveResultDir}/links.txt`, Object.keys(checkURLListObj).join('\n'));
    console.log('=== FINISH ===')
    await browser.close();
  }
})();



// const sampleLinkText = fs.readFileSync(path.resolve(__dirname,"result/test.txt"),'utf8')
// const sampleLinkAry = sampleLinkText.split(',')

// const targetLinkAry = sampleLinkAry.filter(link => link.startsWith(targetURL))
// // console.log('targetLinkAry', targetLinkAry)

// checkLinks(targetLinkAry)

let checkURLListObj = {};
function checkLinks(linkAry){
  console.log('checkLinks')
  for(let i=0; i<linkAry.length; i++){
    const keyAry = Object.keys(checkURLListObj)
    // console.log('keyAry', keyAry)
    let currentLink = linkAry[i]
    currentLink = currentLink.split('?')[0]
    currentLink = currentLink.split('#')[0]
    if(
      !keyAry.includes(currentLink) &&
      !currentLink.includes('.pdf') &&
      !currentLink.includes('.zip') &&
      !currentLink.includes('.csv') &&
      !currentLink.includes('.xlsx')
    ){
      checkURLListObj[currentLink] = false
    }
  }
  // console.log('RESULT', checkURLListObj)
  return checkURLListObj
}

function checkURL(url){
  const keyAry = Object.keys(checkURLListObj)
  if(keyAry.includes(url)){
    checkURLListObj[url] = true
  }
}
