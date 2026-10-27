import { notFound } from "next/navigation";
import { ApiError } from "./api";

/**
 * Run a data loader for a page. Returns null when the API is unreachable (the page then
 * shows <ApiDown/>), turns a 404 into Next's not-found page, and rethrows anything else.
 */
export async function load<T>(loader: () => Promise<T>): Promise<T | null> {
  try {
    return await loader();
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) notFound();
      return null;
    }
    throw error;
  }
}
