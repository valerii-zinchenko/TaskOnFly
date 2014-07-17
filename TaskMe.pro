greaterThan(QT_MAJOR_VERSION, 4):QT += widgets webkitwidgets

# Add more folders to ship with the application, here
html.source = html
html.target = .
js.source = js
js.target = .
css.source = css
css.target = .
templates.source = templates
templates.target = .
test_js.source = test/js
test_js.target = .
DEPLOYMENTFOLDERS = html js css templates test_js

# Define TOUCH_OPTIMIZED_NAVIGATION for touch optimization and flicking
#DEFINES += TOUCH_OPTIMIZED_NAVIGATION

# The .cpp file which was generated for your project. Feel free to hack it.
SOURCES += main.cpp

# Please do not modify the following two lines. Required for deployment.
include(html5applicationviewer/html5applicationviewer.pri)
qtcAddDeployment()

OTHER_FILES += \
    package.json \
    LICENSE.txt
