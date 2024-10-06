// const fs = require('fs');
import {toPascalCase} from './getPathPage'


// Helper function to generate the selector string based on target attributes
function generateSelector(target) {
  if (target.id) {
    return `screen.getByTestId('${target.id}')`;
  } else if (target.class) {
    return `screen.getByClass('${target.class}')`; // If using custom class-based selector
  } else if (target.tag) {
    return `screen.getByTag('${target.tag}')`; // Fallback to tag, if nothing else is available
  }
  return null;
}

// Function to map interaction data to Jest test code
export function generateJestCode(interactions, componentPath) {
    const componentName = toPascalCase(componentPath)+"Page"
  let jestCode = `
    import { render, screen, fireEvent } from '@testing-library/react';
    import ${componentName} from "@/app/${componentPath}/${componentName}';

    describe('User Interaction Scenario', () => {
      beforeEach(() => {
        render(<${componentName} />);
      });
  `;

  interactions.forEach((interaction, index) => {
    let selector = generateSelector(interaction.target);
    if (!selector) {
      console.warn(`No selector could be generated for interaction: ${interaction.type}`);
      return;
    }

    let interactionBlock = `
      it('should handle ${interaction.type} event ${index + 1}', () => {
    `;

    // Generate event-specific Jest code
    switch (interaction.type) {
      case 'click':
      case 'dblclick':
        interactionBlock += `
          const element = ${selector};
          fireEvent.${interaction.type}(element);
        `;
        break;

      case 'mouseenter':
      case 'mouseleave':
        interactionBlock += `
          const element = ${selector};
          fireEvent.${interaction.type}(element);
        `;
        break;

      case 'input':
      case 'change':
        interactionBlock += `
          const inputElement = ${selector};
          fireEvent.${interaction.type}(inputElement, { target: { value: '${interaction.value}' } });
          expect(inputElement.value).toBe('${interaction.value}');
        `;
        break;

      case 'focus':
      case 'blur':
        interactionBlock += `
          const inputElement = ${selector};
          fireEvent.${interaction.type}(inputElement);
        `;
        break;

      case 'keydown':
        interactionBlock += `
          const inputElement = ${selector};
          fireEvent.${interaction.type}(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
        `;
        break;

      case 'touchstart':
      case 'touchmove':
      case 'touchend':
        interactionBlock += `
          const element = ${selector};
          fireEvent.${interaction.type}(element, { touches: [{ clientX: 0, clientY: 0 }] });
        `;
        break;

      case 'resize':
        interactionBlock += `
          global.innerWidth = 500;
          global.dispatchEvent(new Event('resize'));
        `;
        break;

      case 'scroll':
        interactionBlock += `
          const scrollElement = ${selector};
          fireEvent.scroll(scrollElement, { target: { scrollY: ${interaction.scrollPosition} } });
        `;
        break;

      default:
        console.warn(`Unhandled event type: ${interaction.type}`);
    }

    interactionBlock += `
      });
    `;
    jestCode += interactionBlock;
  });

  jestCode += `
    });
  `;

  return jestCode;
}

// export const writeGeneratedTestFile = (interactionData) => {
//     const generatedCode = generateJestCode(interactionData);
//     fs.writeFileSync('generatedInteraction.test.js', generatedCode);

//     console.log('Test file generated: generatedInteraction.test.js');
// }

// Generate Jest code from interaction data


// Save the generated code as a .test.js file

