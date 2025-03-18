# Prospect AI Mailing

A modern AI-powered mailing system built with SvelteKit and Python.

## Project Structure

The project is divided into two main parts:

- `front/`: Frontend application built with SvelteKit and TailwindCSS
- `back/`: Backend API built with Python

## Tech Stack

### Frontend
- SvelteKit 2.x
- TailwindCSS 4.x
- DaisyUI
- TypeScript
- Vite

### Backend
- Python
- SQLAlchemy (Database ORM)

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd front
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd back
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python run.py
```

## Development

- Frontend runs on `http://localhost:5173` by default
- Backend API runs on `http://localhost:5000` by default

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
