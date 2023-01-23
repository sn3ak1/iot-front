package pl.agh.projektiot

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import com.amplifyframework.api.ApiException
import com.amplifyframework.api.rest.RestOptions
import com.amplifyframework.api.rest.RestResponse
import com.amplifyframework.core.Amplify

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val request = RestOptions.builder()
            .addPath("/mqtt")
            .addBody("{\"name\":\"Mow the lawn\"}".toByteArray())
            .build()

        val tv: TextView = findViewById(R.id.helloworld)

        tv.setOnClickListener {
            Amplify.API.post(
                request,
                { Log.i("MyAmplifyApp", "POST succeeded: $it") },
                { Log.e("MyAmplifyApp", "POST failed", it) }
            )
        }
    }
}