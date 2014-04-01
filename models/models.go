package models

import (
	"fmt"
	"github.com/Unknwon/com"
	"github.com/Unknwon/goconfig"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/toolbox"
	"os"
	"time"
)

const (
	_CFG_PATH = "conf/app.conf"
)

var Cfg *goconfig.ConfigFile

func InitModels() {
	if com.IsFile(_CFG_PATH) {
		os.Create(_CFG_PATH)
	}
	var err error
	Cfg, err = goconfig.LoadConfigFile(_CFG_PATH)
	if err == nil {
		beego.Info("Initialize app.conf")
	} else {
		fmt.Println(err)
		os.Exit(2)
	}

	// 添加一个定时任务
	newTask := toolbox.NewTask("first task", "0 */5 * * * *", firstTask)
	toolbox.AddTask("first task", newTask)
	toolbox.StartTask()
}

func firstTask() error {
	fmt.Println("task: ", time.Now())
	return nil
}
