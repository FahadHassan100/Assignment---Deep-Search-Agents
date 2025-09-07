## Key Points for Running the Project

1. **Install dependencies**: Run `uv sync` in the project root
2. **Set environment variables**: Create a `.env` file with your OpenAI API key
3. **Run the project**: Use `uv run python main.py`

## Common Issues and Solutions

### Import Errors

- Make sure all directories have `__init__.py` files
- Use relative imports in the package structure
- Run from the project root directory

### Missing Dependencies

- Check that `openai-agent-sdk` is properly installed
- Update `pyproject.toml` with all required dependencies
- Run `uv sync` to install/update dependencies

### Environment Variables

- Create a `.env` file in the project root
- Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
- Load environment variables in your code if needed

This structure follows Python packaging best practices and should resolve your import issues while keeping your code organized and maintainable.
