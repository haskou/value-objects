import { Timestamp } from '../value-objects/time/Timestamp';
import { DomainError } from './DomainError';

export class InvalidTimestampIntervalError extends DomainError {
  constructor(start: Timestamp, end: Timestamp) {
    super(
      `Invalid TimestampInterval, start (${start.valueOf()}) must be before the end (${end.valueOf()})`,
    );
  }
}
