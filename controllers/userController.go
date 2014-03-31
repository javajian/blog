package controllers

import (
	"blog/models"
	"github.com/astaxie/beego"
)

type UserController struct {
	baseController
}

func (this *UserController) Get() {
	this.Data["Website"] = "beego.cn"
	this.Data["Email"] = "astaxie@gmail.com"
	users, err := models.FindAllUsers()
	if err != nil {
		beego.Error(err)
	}
	this.Data["users"] = users
	this.TplNames = "index.html"
}
