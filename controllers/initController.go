package controllers

import (
	"blog/models"
	"github.com/astaxie/beego"
	"github.com/beego/compress"
	"github.com/beego/i18n"
	"github.com/howeyc/fsnotify"
	"path/filepath"
	"strings"
	"time"
)

var (
	CompressConfPath = "conf\\compress.json"
)

func initLocales() {
	// Initialized language type list.
	langs := strings.Split(models.Cfg.MustValue("lang", "types"), "|")
	names := strings.Split(models.Cfg.MustValue("lang", "names"), "|")
	langTypes = make([]*langType, 0, len(langs))
	for i, v := range langs {
		langTypes = append(langTypes, &langType{
			Lang: v,
			Name: names[i],
		})
	}

	for _, lang := range langs {
		beego.Trace("Loading language: " + lang)
		if err := i18n.SetMessage(lang, "conf/"+"locale_"+lang+".ini"); err != nil {
			beego.Error("Fail to set message file: " + err.Error())
			return
		}
	}
}

func settingCompress() {
	setting, err := compress.LoadJsonConf(CompressConfPath, IsPro, "/")
	if err != nil {
		beego.Error(err)
		return
	}

	setting.RunCommand()

	if IsPro {
		setting.RunCompress(true, false, true)
	}

	beego.AddFuncMap("compress_js", setting.Js.CompressJs)
	beego.AddFuncMap("compress_css", setting.Css.CompressCss)
}

func loadtimes(t time.Time) int {
	return int(time.Now().Sub(t).Nanoseconds() / 1e6)
}

func initTemplates() {
	beego.AddFuncMap("loadtimes", loadtimes)
}

func InitApp() {
	initTemplates()
	initLocales()
	settingCompress()

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		panic("Failed start app watcher: " + err.Error())
	}

	go func() {
		for {
			select {
			case event := <-watcher.Event:
				switch filepath.Ext(event.Name) {
				case ".conf":
					beego.Info(event)

					if err := i18n.ReloadLangs(); err != nil {
						beego.Error("Conf Reload: ", err)
					}

					beego.Info("Config Reloaded")

				case ".json":
					beego.Info(event)
					settingCompress()
					beego.Info("Beego Compress Reloaded")
				}
			}
		}
	}()

	if err := watcher.WatchFlags("conf", fsnotify.FSN_MODIFY); err != nil {
		beego.Error(err)
	}
}
