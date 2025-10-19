# MyPet

A digital pet application built with vanilla JavaScript. Create and care for your virtual pet by managing their happiness, hunger, and energy levels through interactive activities.

Created by Peter and his niece in October 2025.

## Live Demo

Visit the live application: [https://mypet-mu.vercel.app](https://mypet-mu.vercel.app)

## Features

- **Pet Creation**: Choose between a cat or dog, name your pet, and describe its appearance
- **Interactive Care**: Feed, play with, and let your pet rest
- **Real-time Stats**: Monitor your pet's happiness, hunger, and energy levels
- **Persistent Storage**: Your pet data is saved locally in the browser
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- Vanilla JavaScript (ES6 modules)
- HTML5 & CSS3
- LocalStorage for data persistence
- Deployed on Vercel

## Project Structure

```
mypet/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Application styles
├── js/
│   ├── app.js             # Application initialization
│   ├── state.js           # State management
│   ├── components/
│   │   ├── petCreator.js      # Pet creation UI
│   │   ├── petDisplay.js      # Pet visualization
│   │   ├── statsDisplay.js    # Stats monitoring
│   │   └── activityControls.js # Activity buttons
│   └── utils/
│       └── helpers.js     # Utility functions
└── vercel.json            # Vercel deployment config
```

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/petersomerville/mypet.git
cd mypet
```

2. Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## Deployment

This project is configured for automatic deployment on Vercel. Any push to the `main` branch will trigger a new deployment.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

This is a personal project, but feel free to fork and experiment with your own version!
