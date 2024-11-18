import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { Size } from "src/types/misc";

export function iconSize(size: Size): SizeProp | undefined {
    switch (size) {
        case 'xsmall': return '2xs';
        case 'small': return 'sm';
        case 'medium': return undefined;
        case 'large': return 'lg';
        case 'xlarge': return '2xl';
    }
}

export function avatarSize(size: Size): string {
    switch (size) {
        case 'xsmall': return '25px';
        case 'small': return '30px';
        case 'medium': return '40px';
        case 'large': return '60px';
        case 'xlarge': return '80px';
    }
}

export function fontSize(size: Size): string {
    switch (size) {
        case 'xsmall': return '0.8rem';
        case 'small': return '0.9rem';
        case 'medium': return '1rem';
        case 'large': return '1.2rem';
        case 'xlarge': return '1.4rem';
    }
}
