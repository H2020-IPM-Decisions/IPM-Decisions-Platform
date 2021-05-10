const { browser } = require("protractor");
const { async } = require("rxjs/internal/scheduler/async");

describe("Homepage", function () {
  it("should land in the home page", async function () {
    debugger;
    await browser.driver.manage().window().maximize();
    await browser.driver.get('http://localhost:4200/');
		await browser.driver.findElement(by.id("home-anchor-login")).click();
		await browser.driver.findElement(by.id("login-email")).sendKeys('masinonicoletti@gmail.com');
		await browser.driver.findElement(by.id("login-password")).sendKeys('Password1!');
		await browser.driver.findElement(by.id("login-email")).click();
		await browser.driver.findElement(by.xpath("//div[@id='register-link']/button")).click();
    // await browser.driver.findElement(by.id("farm-list-page-label"))
  });
});
