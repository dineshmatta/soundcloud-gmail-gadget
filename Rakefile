require 'rake'
require 'erb'

VENDOR_JS_FILES = %w(http://code.jquery.com/jquery-1.7.2.min.js https://raw.github.com/rngtng/soundcloud-widgetify/master/sc-widgetify.js)
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

def merge(in_files, out_file, minify = false)
  if minify
    "juicer -q merge -s -f -o #{out_file} #{Array(in_files).join(' ')}"
  else
    "cat #{Array(in_files).join(' ')} > #{out_file}"
  end
end

def build_gadget(js_files, css_files, out_file)
  sh <<-END
    mkdir -p #{File.dirname(out_file)}
    #{merge(js_files, "javascripts.js")}
    echo "@javascripts = File.open('javascripts.js').read" >> gadget.rb

    #{merge(css_files, "styles.css")}
    echo "@styles = File.open('styles.css').read" >> gadget.rb

    erubis -E PrintOut -l ruby google-app/gadget.html.erb  >> gadget.rb
    ruby gadget.rb > #{out_file}

    rm -f javascripts.js styles.css gadget.rb
  END
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
    build_gadget @js_files, @css_files, "#{@out_path}/gadget.html"

    puts <<-END
      \n\nRun with:
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
    build_gadget @js_files, @css_files, "gadget.html"

    sh <<-END
      mkdir -p #{@out_path}
      echo "@title = '#{TITLE}';@version = '#{VERSION}';@description = '#{DESCRIPTION}'" > gadget.rb
      erubis -E DeleteIndent,PrintOut -l ruby #{@in_path}/application-manifest.xml.erb >> gadget.rb
      ruby gadget.rb > #{@out_path}/application-manifest.xml

      echo "@title = '#{TITLE}';@version = '#{VERSION}';@description = '#{DESCRIPTION}'" > gadget.rb
      echo "@gadget = File.open('gadget.html').read" >> gadget.rb
      erubis -E PrintOut -l ruby #{@in_path}/gadget.xml.erb >> gadget.rb
      ruby gadget.rb > #{@out_path}/gadget.xml

      rm -f gadget.rb gadget.html
    END
  end
end


namespace 'chrome' do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = vendor_js_files + %W(src/gadgetize.js src/loader.js #{@in_path}/main.js)
    @css_files = %w(src/style.css)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    sh <<-END
      mkdir -p #{@out_path}
      #{merge(@js_files, "#{@out_path}/javascripts.js", true)}
      #{merge(@css_files, "#{@out_path}/styles.css", true)}
      cp assets/logo* #{@out_path}/
    END

    File.open("#{@out_path}/manifest.json", "w") do |file|
      file.write ERB.new(File.read("#{@in_path}/manifest.json.erb")).result
    end
  end

  task :release => :prepare do
    sh "zip -r build/chrome-extension.zip #{@out_path}/"
  end
end


namespace 'firefox' do
  task :prepare do |task|
    @in_path   = task.scope.last
    @out_path  = "build/#{@in_path}"
    @js_files  = %W(src/gadgetize.js src/loader.js)
    @css_files = %w(src/style.css)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    sh <<-END
      mkdir -p #{@out_path}/lib
      mkdir -p #{@out_path}/data
      #{merge(@js_files, "#{@out_path}/data/javascripts.js")}
      #{merge(@css_files, "#{@out_path}/data/styles.css")}
      echo "@title = '#{TITLE}';@version = '#{VERSION}';@description = '#{DESCRIPTION}'" > gadget.rb
      erubis -E PrintOut -l ruby #{@in_path}/package.json.erb >> gadget.rb
      ruby gadget.rb > #{@out_path}/package.json
      cp #{@in_path}/main.js #{@out_path}/lib
      cp assets/logo-48.png #{@out_path}/icon.png
      rm -f gadget.rb
    END
    vendor_js_files.each do |file|
      sh "cp #{file} #{@out_path}/data/"
    end
  end

  task :release => :prepare do
    cfx "--pkgdir=#{@out_path} xpi"
    sh <<-END
      mv soundcloud-gmail-firefox-extension.xpi build/firefox-extension.xpi
    END
  end

  task :test => :prepare do
    cfx "--pkgdir=#{@out_path} test"
  end

  task :run => :prepare do
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
  Rake::Task["google-app:build"].execute
  Rake::Task["chrome:build"].execute
  Rake::Task["firefox:build"].execute
end

desc "Release all"
task :release_all => :build_all do
  #Rake::Task["google-app:release"].execute - NOTHING to do
  Rake::Task["chrome:release"].execute
  Rake::Task["firefox:release"].execute
end

desc "Deploys gadget to live branch"
task :deploy => :build_all do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to deploy!"
    exit!
  end

  if `git fetch --tags && git tag`.split(/\n/).include?(VERSION)
    raise "Version #{VERSION} already deployed"
  end

  sh <<-END
    cp LICENSE VERSION CHANGES.md build/
    git checkout --track -b build origin/build
    git checkout build
    rm -rf *extension*
    rm -rf google-app
    mv -f build/* .
    git commit -a --allow-empty -m 'Release #{VERSION}'

    git push origin build
    git push origin --tags
    git checkout master
  END
end

task :default => :build_all
