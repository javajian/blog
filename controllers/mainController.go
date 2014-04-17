package controllers

type MainController struct {
	baseController
}

func (this *MainController) Get() {
	this.Data["Website"] = "beego.dsa"
	this.Data["Email"] = "astaxie@gmail.com"
	this.TplNames = "home.html"
}
