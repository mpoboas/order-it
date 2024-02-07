import {ValueObject} from '../../core/domain/ValueObject';
import {FailureType, Result} from '../../core/logic/Result';
import {Guard} from '../../core/logic/Guard';

const MAX_NAME_LENGTH = 21;

interface ResponsibleNameProps {
    value: string;
}

export class ResponsibleName extends ValueObject<ResponsibleNameProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: ResponsibleNameProps) {
        super(props);
    }

    public static create(name: string): Result<ResponsibleName> {
        const argName = 'Responsible Name';

        // Check if the name is null or undefined.
        const guardResult = Guard.againstNullOrUndefined(name, argName);
        if (!guardResult.succeeded) {
            return Result.fail<ResponsibleName>(guardResult.message, FailureType.InvalidInput);
        }

        // Check if the name is empty.
        const guardAgainstEmpty = Guard.onlyContainsSpaces(name, argName);
        if (guardAgainstEmpty.succeeded) {
            return Result.fail<ResponsibleName>(argName + 'cannot be empty.', FailureType.InvalidInput);
        }

        // Check if the name is too long or too short.
        const rangeGuard = Guard.inRange(name.length, 1, MAX_NAME_LENGTH, argName);
        if (!rangeGuard.succeeded) {
            return Result.fail<ResponsibleName>(rangeGuard.message, FailureType.InvalidInput);
        }

        // Check if the name is alphanumeric.
        const alphanumericGuard = Guard.onlyContainsAlphanumericsAndSpaces(name, argName);
        if (!alphanumericGuard.succeeded) {
            return Result.fail<ResponsibleName>(alphanumericGuard.message, FailureType.InvalidInput);
        }

        // If all the checks pass, return the name.
        return Result.ok<ResponsibleName>(new ResponsibleName({value: name}));
    }
}
