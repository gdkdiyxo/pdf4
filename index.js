const express = require('express')
const puppeteer = require('puppeteer')
const path = require('path')
const app = express()
app.get("/api/getpdf", async (req, res) => {
    const browser = req.app.get("browser")
    if(!req.query.link){
        return res.sendStatus(400)
    }
    try{
        let page = await browser.newPage()
        await page.goto(req.query.link)
        let pdf = await page.pdf()
        res.contentType("application/pdf")
        res.write(pdf, 'binary')
        res.end()
        page.close()
    }
    catch(e){
        return res.sendStatus(400)
    }
})
app.use(express.static(path.join(__dirname, "views")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"))
})
const main = async () => {
    app.set("browser", await puppeteer.launch())
    console.log("listening on port 3000")
    app.listen(3000)
}

main()