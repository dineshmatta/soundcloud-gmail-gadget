require 'rake'
require 'erb'

VENDOR_JS_FILES = %w(http://code.jquery.com/jquery-1.7.2.js https://raw.github.com/rngtng/soundcloud-widgetify/master/sc-widgetify.js)
TITLE           = "SoundCloud Sounds in Google Mail\\u2122"
VERSION         = File.open('VERSION').read.strip
DESCRIPTION     = "Show SoundCloud Widget for any sound url in Google Mail\\u2122"

def vendor_js_files
  VENDOR_JS_FILES.map do |file|
    File.basename(file).tap do |out|
      `wget #{file} -O #{out}` unless File.exists?(out)
    end
  end
end

def save(in_files, out_file)
  File.open(out_file, "w") do |file|
    file.write merge(in_files)
  end
end

def merge(files)
  Array(files).map do |name|
    File.read(name).tap do |content|
      content.replace(ERB.new(content).result) if name =~ /\.erb/
    end
  end.join("\n\n")
end

def cfx(command)
  sh <<-END
    cd /Applications/addon-sdk
    source bin/activate
    cd -
    cfx #{command}
  END
end


namespace :example do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = vendor_js_files + %W(src/gadgetize.js #{@in_path}/main.js)
    @css_files = %W(src/style.css)
  end

  desc "Build the Example file"
  task :build => :prepare do
    `mkdir -p #{@out_path}`
    @javascripts = merge(@js_files)
    @styles = merge(@css_files)
    save("google-app/gadget.html.erb", "#{@out_path}/gadget.html")

    puts <<-END
      Run with:
      open #{@out_path}/gadget.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1\n
    END
  end
end


namespace 'google-app' do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = vendor_js_files + %W(src/gadgetize.js #{@in_path}/main.js)
    @css_files = %W(#{@in_path}/style.css src/style.css)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    `mkdir -p #{@out_path}`
    @javascripts = merge(@js_files)
    @styles = merge(@css_files)
    @gadget = ERB.new(File.read("google-app/gadget.html.erb")).result
    save("#{@in_path}/gadget.xml.erb", "#{@out_path}/gadget.xml")
    save("#{@in_path}/application-manifest.xml.erb", "#{@out_path}/application-manifest.xml")
  end
end


namespace :chrome do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = vendor_js_files + %W(src/gadgetize.js src/loader.js #{@in_path}/main.js)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    `mkdir -p #{@out_path}`
    `cp assets/logo* #{@out_path}/`
    save(@js_files, "#{@out_path}/javascripts.js")
    save("#{@in_path}/manifest.json.erb", "#{@out_path}/manifest.json")
  end

  task :release => :build do
    sh "zip -r build/chrome-extension.zip #{@out_path}/"
  end
end

namespace :firefox do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = %W(src/gadgetize.js src/loader.js)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    sh <<-END
      mkdir -p #{@out_path}/lib
      mkdir -p #{@out_path}/data
      cp #{@in_path}/main.js #{@out_path}/lib
      cp assets/logo-48.png #{@out_path}/icon.png
    END
    save(@js_files, "#{@out_path}/data/javascripts.js")
    save("#{@in_path}/package.json.erb", "#{@out_path}/package.json")

    vendor_js_files.each do |file|
      sh "cp #{file} #{@out_path}/data/"
    end
  end

  task :release => :build do
    cfx "--pkgdir=#{@out_path} xpi"
    sh <<-END
      mv soundcloud-gmail-firefox-extension.xpi build/firefox-extension.xpi
    END
  end

  task :test => :build do
    cfx "--pkgdir=#{@out_path} test"
  end

  task :run => :build do
    cfx "--pkgdir=#{@out_path} run"
  end
end

task :clean do
  sh <<-END
    rm -rf build live *.js
  END
end

desc "Build all"
task :build_all => :clean do
  Rake::Task["example:build"].invoke
  Rake::Task["google-app:build"].invoke
  Rake::Task["chrome:build"].invoke
  Rake::Task["firefox:build"].invoke
end

desc "Release all"
task :release_all do
  Rake::Task["google-app:build"].invoke
  Rake::Task["chrome:release"].invoke
  Rake::Task["firefox:release"].invoke
end

desc "Deploys gadget to live branch"
task :deploy => :release_all do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to deploy!"
    exit!
  end

  if `git fetch --tags && git tag`.split(/\n/).include?(VERSION)
    raise "Version #{VERSION} already deployed"
  end

  sh <<-END
    cp LICENSE VERSION CHANGES.md build/
    git checkout --track -b gh-pages origin/gh-pages
    git checkout gh-pages
    rm *.js
    rm -rf chrome
    rm -rf firefox
    rm -rf example
    rm -rf google-app
    mv -f build/* .
    git commit -a --allow-empty -m 'Release #{VERSION}'

    git push origin gh-pages
    git push origin --tags
    rm -rf chrome
    rm -rf firefox
    rm -rf example
    rm -rf google-app
    rm *.zip
    rm *.xpi
    git checkout master
  END
end

task :default => :build_all
