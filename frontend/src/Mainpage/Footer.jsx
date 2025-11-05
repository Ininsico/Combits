const Footer = () => {
  // Define theme inside the component
  const currentTheme = {
    border: 'border-gray-200',
    bg: 'bg-white',
    text: 'text-gray-900',
    mutedText: 'text-gray-600'
  };

  return (
    <footer className={`py-12 border-t ${currentTheme.border} ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>Kids Heaven School</div>
            <p className={`${currentTheme.mutedText}`}>
              Revolutionizing education management with cutting-edge technology and innovative solutions.
            </p>
          </div>
          {[
            {
              title: 'Product',
              links: ['About', 'Pricing', 'Security', 'Updates']
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Security', 'Compliance']
            }
          ].map((section) => (
            <div key={section.title}>
              <h4 className={`font-bold text-lg mb-4 ${currentTheme.text}`}>{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`hover:text-green-500 transition-colors ${currentTheme.mutedText}`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`border-t ${currentTheme.border} mt-12 pt-8 text-center ${currentTheme.mutedText}`}>
          <p>&copy; 2025 Kids Heaven School. All rights reserve.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;