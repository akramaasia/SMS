import { Logger } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import type { ScopeContext } from "@sentry/types";
import type { FastifyRequest } from "fastify";
import { isEmpty, throttle } from "lodash";
import type { TypeORMError } from "typeorm";


export namespace CommonErrorHelper {
 export type Error = AuthenticationError
                   | AuthenticationTimeoutError
                   | AuthorizationError
                   | BadRequestError
                   | ConflictError
                   | InternalError
                   | InvalidDataError
                   | NotAcceptableError
                   | NotFoundError
                   | NotImplementedError
                   | DbError
                   | ServiceUnavailableError
                   | TimeoutError
                   | ValidationError
                   | Warning


 export interface ErrorOptions {
   code?: string
   extra?: {
     [ key: string ]: unknown
   }
   internal?: boolean
   level?: ErrorLevel
   logError?: boolean
   req?: FastifyRequest
   skipConsole?: boolean
 }


 export const enum ErrorLevel {
   ERROR = "error",
   WARNING = "warning",
 }
}


export namespace ConflictError {
    export type Error = Record<string, unknown>
   }
   
   
   export namespace FirebaseError {
    export interface Error {
      code: string
      message: string
    }
   }
   
   
   const errorHandler = throttle(
    ( err: CommonErrorHelper.Error, options: CommonErrorHelper.ErrorOptions ) => {
      const sentryOptions: Partial<ScopeContext> = {
        level: options.level,
      };
   
   
      if( ! isEmpty( options.extra ) ) {
        // Extra doesn't support two level of nesting for object, so convert to JSON
        for( const [ key, value ] of Object.entries( options.extra ) ) {
          options.extra[ key ] = JSON.stringify( value );
        }
   
   
        sentryOptions.extra = options.extra;
      }
   
   
      if( process.env.SENTRY_DSN ) {
        try {
          Sentry.captureException( err, sentryOptions );
        } catch( error ) {
          throw error;
        }
      }
    },
    100,
   );
   
   
   export class BaseError extends Error {
    message: string;
    options?: CommonErrorHelper.ErrorOptions;
    statusCode?: number;
    userBlocked?: boolean;
    constructor( message?: string, options?: CommonErrorHelper.ErrorOptions ) {
        super( message );
        this.message = message || "Unknown Error";
        this.options = options;
      }
     
     
      toJSON() {
        return {
          message: this.options?.internal ? "Unknown Error" : this.message,
        };
      }
     }
     
     
     /** Maps to 400 (Bad Request) */
     export class BadRequestError extends BaseError {
      statusCode = 400;
     
     
      constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
        super( message, Object.assign( { logError: true }, options ) );
      }
     }
     
     
     /** Maps to 401 (Unauthorized) */
     export class AuthenticationError extends BaseError {
      statusCode = 401;
     
     
      constructor( message = "NOT AUTHENTICATED", options?: CommonErrorHelper.ErrorOptions ) {
        super( message, Object.assign( { logError: false }, options ) );
      }
     }
     
     
     /** Maps to 419 (Authentication Timeout). Used exclusively when the session timesout */
     export class AuthenticationTimeoutError extends BaseError {
      statusCode = 419;
     
     
      constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
        super( message, Object.assign( { logError: false }, options ) );
      }
     }
/** Maps to 403 (Forbidden) */
export class AuthorizationError extends BaseError {
    statusCode = 403;
   
   
    constructor( message = "Not authorized", options?: CommonErrorHelper.ErrorOptions ) {
      super( message, Object.assign( { logError: false }, options ) );
    }
   }
   
   
   /** Maps to 409 (Conflict). Happens when data update attempted on expired data */
   export class ConflictError extends BaseError {
    errors?: ConflictError.Error[] | null;
    statusCode = 409;
   
   
    constructor( message: string, errors?: ConflictError.Error[] | null, options?: CommonErrorHelper.ErrorOptions ) {
      super( message, Object.assign( { logError: true }, options ) );
      this.errors = errors;
    }
   
   
    toJSON() {
      return {
        errors: this.errors,
        message: this.message,
        ...( this.options?.extra ),
      };
    }
   }
   
   
   /** Error use to wrap error from TypeORM to have a stack trace of our code instead of the typeorm package. */
   export class DbError extends BaseError {
    typeOrmError: TypeORMError;
   
   
    constructor( typeOrmError: TypeORMError, options?: CommonErrorHelper.ErrorOptions ) {
      super(
        typeOrmError.message,
        Object.assign( { internal: true, logError: true }, options ),
      );
      this.typeOrmError = typeOrmError;
    }
}
    /** Error use to wrap error from Firebase to have a stack trace of our code instead of the firebase package. */
    function getFirebaseErrorMessage( firebaseError: FirebaseError.Error ) {
     if( firebaseError?.message ) {
       return `${ firebaseError.message } (${ firebaseError.code })`;
     }
    
    
     return "Unknown error";
    }
    
    
    const FIREBASE_BLACKLIST_ERROR_CODES = [
     "messaging/registration-token-not-registered",
    ];
    
    
    function shouldLogFirebaseError( firebaseError: FirebaseError.Error ) {
     const errorCode = firebaseError?.code ? `${ firebaseError.code }` : null;
    
    
     if( ! errorCode ) {
       return true;
     }
    
    
     return ( ! FIREBASE_BLACKLIST_ERROR_CODES.includes( errorCode ) );
    }
    
    
    export class FirebaseError extends BaseError {
     firebaseError: FirebaseError.Error;
    
    
     constructor( firebaseError: FirebaseError.Error, options?: CommonErrorHelper.ErrorOptions ) {
       super( getFirebaseErrorMessage( firebaseError ), Object.assign( { extra: { code: firebaseError?.code }, logError: shouldLogFirebaseError( firebaseError ) }, options ) );
       this.firebaseError = firebaseError;
     }
    }
    
    
    /** Wrap internal errors */
    export class InternalError extends BaseError {
     constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
       super( message, Object.assign( { internal: true, logError: true }, options ) );
    }
}


/** Error use when data from databases are invalid (bad format, incoherent...). */
export class InvalidDataError extends BaseError {
 table?: string | null;


 constructor( message: string, table?: string | null, options?: CommonErrorHelper.ErrorOptions ) {
   super( message, Object.assign( { logError: true }, options ) );
   this.table = table;
 }
}


/** Maps to 406 (Not Acceptable).  Used to signal app upgrades */
export class NotAcceptableError extends BaseError {
 statusCode = 406;


 constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
   super( message, Object.assign( { logError: true }, options ) );
 }
}


/** Maps to 404 (Not Found) */
export class NotFoundError extends BaseError {
 statusCode = 404;


 constructor( message?: string, options?: CommonErrorHelper.ErrorOptions ) {
   super( message, Object.assign( { logError: false }, options ) );
 }
}


/** Maps to 501 (Not Implemented) */
export class NotImplementedError extends BaseError {
 statusCode = 501;


 constructor( message = "NOT IMPLEMENTED", options?: CommonErrorHelper.ErrorOptions ) {
   super( message, Object.assign( { logError: false }, options ) );
 }
}


/** Maps to 503 (Service Unavailable) */
export class ServiceUnavailableError extends BaseError {
    statusCode = 503;
   
   
    constructor( message = "Service temporarily unavailable, please try again later", options?: CommonErrorHelper.ErrorOptions ) {
      super( message, Object.assign( { logError: false }, options ) );
    }
   }
   
   
   /** Used for various non-authentication related timeouts */
   export class TimeoutError extends BaseError {
    statusCode = 503;
   
   
    constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
      super( message, Object.assign( { logError: true }, options ) );
    }
   }
   
   
   /** Used when user is blocked */
   export class UserBlockedError extends AuthorizationError {
    statusCode = 403;
    userBlocked = true;
   
   
    constructor( message ) {
      super( message );
    }
   }
   
   
   /** Maps to 422 (Unprocessable Entity) */
   export class ValidationError extends BaseError {
    statusCode = 422;
   
   
    constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
      super( message, Object.assign( { logError: false }, options ) );
    }
   
   
    toJSON() {
      return {
        ...( this.options?.extra && this.options.extra ),
        message: this.message,
      };
    }
}


/** Warnings don't break the application, but are things we should be monitoring */
export class Warning extends BaseError {
 constructor( message: string, options?: CommonErrorHelper.ErrorOptions ) {
   super( message, Object.assign( { logError: true }, options ) );
 }


 toJSON() {
   return {
     ...( this.options?.extra ),
     message: this.message,
     type: "warning",
   };
 }
}


export function handleError( err: CommonErrorHelper.Error, options?: CommonErrorHelper.ErrorOptions ) {
 if( ! err ) {
   return;
 }


 options = {
   level: err instanceof Warning ? CommonErrorHelper.ErrorLevel.WARNING : CommonErrorHelper.ErrorLevel.ERROR,
   ...err.options,
   ...options,
 };


 // Contain all the error that we don't want to log in sentry
 const blacklistErrors = [
   AuthorizationError,
   AuthenticationError,
   AuthenticationTimeoutError,
   ConflictError,
   NotFoundError,
   NotImplementedError,
   ServiceUnavailableError,
   ValidationError,
 ];
 let { logError } = options;


 // If the logError wasn't provide for the error fallback to the default behaviour
 if( logError == null ) {
   logError = ! blacklistErrors.some( ( errorType ) => err instanceof errorType );
 }


 if( logError ) {
   errorHandler( err, options );
 }


 const logParams: Array<CommonErrorHelper.Error | string | Record<string, unknown>> = [];


 if( err.message || err.stack ) {
   logParams.push( err.constructor.name || "Error", err.message, err.stack );
 } else {
   logParams.push( err );
 }


 if( options.extra ) {
   logParams.push( JSON.stringify( options.extra ) );
 }


 Logger.error( logParams.join() );
}


export function throwIfNotFound( result, serviceName?: string, id?: number ) {
 if( ! result ) {
   const message = serviceName ? `${ serviceName } not found` : "Record not found";


   throw new NotFoundError( message, { extra: { id } } );
 }
}



   