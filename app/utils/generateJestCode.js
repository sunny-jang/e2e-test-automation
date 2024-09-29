export const generateJestCode =(interactions) =>{
    return interactions.map(interaction => {
        switch (interaction.type) {
            case 'click':
                return `fireEvent.click(screen.getByRole('${interaction.target.tag}', { name: /submit/i }));`;
            case 'input':
                return `fireEvent.change(screen.getByLabelText(/username/i), { target: { value: '${interaction.value}' } });`;
            // 추가적인 케이스...
        }
    }).join('\n');
}
