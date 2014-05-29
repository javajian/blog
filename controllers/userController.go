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

func (this *UserController) Logout() {
	// GlobalSessions.SessionDestroy(this.Ctx.Output.Context.ResponseWriter, this.Ctx.Input.Request)
	// 销毁session
	// this.DelSession("name")
	// this.DestroySession()
	// sid := this.CruSession.SessionID()
	// beego.Info(sid)
	// this.DelSession(sid)
	// this.DestroySession()
	// this.CruSession
	// this.existsSess()
	beego.GlobalSessions.SessionDestroy(this.Ctx.Output.Context.ResponseWriter, this.Ctx.Input.Request)
	this.Ctx.Output.Body([]byte("ok"))
}

func (this *UserController) CheckEmail() {
	email := this.GetString("email")
	var result string = "true"
	// models.
	total, err := models.CheckEmail(email)
	if err != nil {
		result = "false"
	}
	if total > 0 {
		result = "false"
	} else {
		result = "true"
	}
	content := []byte(result)
	this.Ctx.Output.Body(content)
}

func (this *UserController) Login() {
	beego.Debug("user login.")
	result := make(map[string]interface{})
	result["succ"] = "succ"

	email := this.GetString("email")
	pwd := helper.MD5(this.GetString("pwd"))

	user, has, err := models.FindUserByEmail(email)
	beego.Debug(has)
	if err != nil {
		beego.Error(err)
		result["succ"] = "err"
		result["err"] = err
	} else {
		if has {
			pwded := user.Pwd
			beego.Info("old pwd:" + pwded + ", and new is:" + pwd)
			if pwded != pwd {
				result["succ"] = "err"
				result["err"] = "用户或密码不正确!"
			} else {
				this.SetSession("online_user", "u_"+strconv.FormatInt(user.Id, 10))
				this.SetSession("online_user_email", email)

				result["id"] = user.Pwd
				result["email"] = email
			}
		} else {
			result["succ"] = "err"
			result["err"] = "用户或密码不正确!"
		}
	}
	this.Data["json"] = result
	this.ServeJson()
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
	u.Pwd = helper.MD5(pwd)
	u.Reged = time.Now()
	u.Uname = email

	id, err := models.SaveUser(u)
	if err != nil {
		beego.Error(err)
		result["succ"] = "err"
	} else {
		result["id"] = u.Pwd
		result["email"] = email
	}
	this.SetSession("online_user", "u_"+strconv.FormatInt(id, 10))
	this.SetSession("online_user_email", email)

	this.Data["json"] = result
	this.ServeJson()
}
