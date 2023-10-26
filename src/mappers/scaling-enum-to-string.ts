import { SCALING } from '@/constants';

export type Scaling = (typeof SCALING)[keyof typeof SCALING];

const scalingEnumToString = (scaling: Scaling | number) => {
    switch (scaling) {
        case SCALING.NATIVE:
            return 'Native';
        case SCALING.BLACK_BARS:
            return 'Black Bars';
        case SCALING.STRETCHED:
            return 'Stretched';
        default:
            return 'Unknown';
    }
};

export default scalingEnumToString;
