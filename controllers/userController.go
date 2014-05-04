package controllers

import (
	"blog/models"
	"github.com/astaxie/beego"
	"time"
)

type UserController struct {
	baseController
}

func (this *UserController) Reg() {
	beego.Info("register controller")
	result := make(map[string]interface{})

	email := this.GetString("email")
	pwd := this.GetString("pwd")

	beego.Info(email)
	beego.Info(email)

	u := new(models.User)
	u.Email = email
	u.Pwd = pwd
	u.Reged = time.Now()
	u.Uname = email

	models.SaveUser(u)

	result["succ"] = "mysuc"

	this.Data["json"] = result

	this.ServeJson()
}
