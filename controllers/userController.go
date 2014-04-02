package controllers

type UserController struct {
	baseController
}

func (this *UserController) Get() {
	this.Data["Website"] = "beego.cn"
	this.Data["Email"] = "astaxie@gmail.com"
	this.TplNames = "home.html"
}
