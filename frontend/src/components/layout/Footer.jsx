import { Github, Twitter, ExternalLink, Rocket } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-dark-border bg-dark-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-space-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Cosmic<span className="text-space-400">Watch</span>
              </span>
            </div>
            <p className="text-space-400 text-sm">
              Real-time Near-Earth Object tracking powered by NASA NeoWs API.
              Stay informed about asteroids approaching our planet.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Resources</h4>
            <div className="space-y-2">
              <a
                href="https://api.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-space-400 hover:text-space-300 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                NASA API Portal
              </a>
              <a
                href="https://cneos.jpl.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-space-400 hover:text-space-300 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                NASA CNEOS
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-space-400 hover:text-white hover:border-space-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-space-400 hover:text-white hover:border-space-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-space-500 text-sm">
            © {new Date().getFullYear()} Cosmic Watch. Built for Hackathon.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-space-400 text-sm">API Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
