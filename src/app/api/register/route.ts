import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password }: UserRequestBody = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();
    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
      return NextResponse.json(
        { message: "Email already in use." },
        { status: 409 }
      );
    }
    
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during registration:", error.message);
    } else {
      console.error("Unknown error during registration:", error);
    }
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
