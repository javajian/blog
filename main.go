package main

import (
	"blog/controllers"
	"blog/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	_ "github.com/astaxie/beego/session/redis"
	"github.com/beego/i18n"
	"os"
)

const (
	APP_VER = "0.1"
)

func initialize() {

	models.InitModels()

	// Set App version and log level.
	beego.AppName = models.Cfg.MustValue("beego", "app_name")
	beego.RunMode = models.Cfg.MustValue("beego", "run_mode")

	controllers.IsPro = beego.RunMode == "prod"
	if controllers.IsPro {
		beego.SetLevel(beego.LevelInfo)
		os.Mkdir("./log", os.ModePerm)
		beego.BeeLogger.SetLogger("file", `{"filename": "log/log"}`)
	}

	beego.SessionOn = true
	beego.SessionProvider = "redis"
	beego.SessionSavePath = "127.0.0.1:6379"
	beego.SessionGCMaxLifetime = 300
	beego.SessionName = "blogSid"

	controllers.InitApp()
}

func UrlManager(ctx *context.Context) {
	beego.Info(ctx.Request.RequestURI)
	uri := ctx.Request.RequestURI
	onlineUser := ctx.Input.Session("online_user")
	beego.Info("url manager", onlineUser)

	if "/blog/post" == uri {
		if onlineUser == nil {
			// 判断是否登录
			if ctx.Input.IsAjax() {
				beego.Info("ajax request")
				ctx.Output.Header("Content-Type", "application/json")
				ctx.Output.Body([]byte(`{"succ":"succ",login":"no"}`))
			} else {
				ctx.Redirect(302, "/login")
				beego.Info("document request")
			}
		}
	} else {
		beego.Info("not need login")
	}

}

func main() {
	//初始化
	initialize()

	beego.Info(beego.AppName, APP_VER)

	beego.SetStaticPath("/upfile", "upfile")
	if !controllers.IsPro {
		beego.SetStaticPath("/static_source", "static_source")
		beego.DirectoryIndex = true
	}

	beego.AddFilter("*", "AfterStatic", UrlManager)

	beego.Router("/", &controllers.MainController{}, "*:Index")
	beego.Router("/home", &controllers.MainController{}, "*:Home")
	beego.Router("/about", &controllers.MainController{}, "*:About")
	beego.Router("/contact", &controllers.MainController{}, "*:Contact")
	beego.Router("/login", &controllers.MainController{}, "*:Login")
	beego.Router("/doLogin", &controllers.UserController{}, "post:Login")
	beego.Router("/upload", &controllers.UploadController{}, "*:Upload")
	// uns := beego.NewNamespace("/user").
	// 	Router("/reg", &controllers.UserController{}, "post:Reg").
	// 	Router("/checkEmail", &controllers.UserController{}, "post:CheckEmail").
	// 	Router("/logout", &controllers.UserController{}, "*:Logout")

	// bns := beego.NewNamespace("/blog").
	// 	Router("/posting", &controllers.BlogController{}, "*:Posting").
	// 	Router("/post", &controllers.BlogController{}, "*:Post")

	beego.Router("/user/reg", &controllers.UserController{}, "post:Reg")
	beego.Router("/user/checkEmail", &controllers.UserController{}, "post:CheckEmail")
	beego.Router("/user/logout", &controllers.UserController{}, "*:Logout")

	beego.Router("/blog/posting", &controllers.BlogController{}, "*:Posting")
	beego.Router("/blog/post", &controllers.BlogController{}, "*:Post")

	// Register template functions.
	beego.AddFuncMap("i18n", i18n.Tr)

	// beego.AddNamespace(uns, bns)
	beego.Run()
}
