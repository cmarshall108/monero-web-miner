import os
import sys
import tornado
import tornado.web

from tornado.options import define, options


class Application(tornado.web.Application):

    def __init__(self):
        kwargs = dict(
            template_path=os.path.join(os.path.dirname(__file__), 'src/templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'src'),
        )

        self._handlers = [
            (r"/(.*)", tornado.web.StaticFileHandler,
                dict(
                    path=kwargs['static_path'],
                    default_filename='templates/index.html',
                ),
            ),
        ]

        super(Application, self).__init__(self._handlers, **kwargs)

def main():
    define('port', default=80, help='Runs the webserver on any given port.', type=int)

    tornado.options.parse_command_line()

    server = tornado.httpserver.HTTPServer(Application())
    server.listen(options.port)

    tornado.ioloop.IOLoop.current().start()

    return 0

if __name__ == '__main__':
    sys.exit(main())
