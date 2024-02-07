import {ValueObject} from '../../core/domain/ValueObject';
import {FailureType, Result} from '../../core/logic/Result';
import {Guard} from '../../core/logic/Guard';

interface ItemUnitsQuantityProps {
    numberOfUnits: number;
}

export class ItemUnitsQuantity extends ValueObject<ItemUnitsQuantityProps> {
    get numberOfUnits(): number {
        return this.props.numberOfUnits;
    }

    private constructor(props: ItemUnitsQuantityProps) {
        super(props);
    }

    public static create(numberOfUnits: number): Result<ItemUnitsQuantity> {
        const guardResult = Guard.againstNullOrUndefined(numberOfUnits, 'Number of Units');
        if (!guardResult.succeeded) {
            return Result.fail<ItemUnitsQuantity>(guardResult.message, FailureType.InvalidInput);
        }

        // Check if the number of units is less than 1.
        if (numberOfUnits < 1) {
            return Result.fail<ItemUnitsQuantity>('Number of units cannot be less than 1', FailureType.InvalidInput);
        }

        // Check if number is not an integer.
        if (numberOfUnits % 1 !== 0) {
            return Result.fail<ItemUnitsQuantity>('Number of units must be an integer', FailureType.InvalidInput);
        }

        return Result.ok<ItemUnitsQuantity>(new ItemUnitsQuantity({numberOfUnits}));
    }
}
