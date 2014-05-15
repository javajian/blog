package controllers

import (
	"blog/helper"
	"blog/models"
	"github.com/astaxie/beego"
	"strconv"
	"time"
)

type UserController struct {
	baseController
}

func (this *UserController) Reg() {

	beego.Info("register controller")
	result := make(map[string]interface{})
	result["succ"] = "succ"

	email := this.GetString("email")
	pwd := this.GetString("pwd")

	beego.Info(email)
	beego.Info(pwd)

	u := new(models.User)
	u.Email = email
	u.Pwd = pwd
	u.Reged = time.Now()
	u.Uname = email

	id, err := models.SaveUser(u)
	if err != nil {
		beego.Error(err)
		result["succ"] = "err"
	}
	sess := GlobalSessions.SessionStart(this.Ctx.Output.Context.ResponseWriter, this.Ctx.Input.Request)
	defer sess.SessionRelease(this.Ctx.Output.Context.ResponseWriter)

	sess.Set("online_user_md5", helper.MD5(strconv.FormatInt(id, 10)))
	sess.Set("online_user", "u_"+strconv.FormatInt(id, 10))

	this.Data["json"] = result
	this.ServeJson()
}
